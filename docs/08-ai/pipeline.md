# Fables Flow --- AI Order Parsing Pipeline Architecture

This document specifies the step-by-step engineering design of the AI Parsing Pipeline that transforms informal WhatsApp text and voice inputs into formal transactional orders.

---

## 1. Pipeline Stages

The pipeline executes asynchronously as a series of worker steps inside a BullMQ job container.

```text
Incoming Webhook
       │
       ▼
1. INGESTION & DEDUPLICATION (Twilio / Meta WABA Signature Validation)
       │
       ▼
2. TEXT NORMALIZATION (Strip emojis, format unicode, transcribe audio files)
       │
       ▼
3. LANGUAGE CLASSIFICATION (English vs. Hindi vs. Hinglish vs. Regional)
       │
       ▼
4. VECTOR MATCHING (Query pgvector for candidate products based on text tokens)
       │
       ▼
5. LLM EXTRACTION (Pass prompt with Candidate Product list + message to Model)
       │
       ▼
6. SCHEMA VALIDATION (Zod matches JSON parse format; aborts on fail)
       │
       ▼
7. BUSINESS RULES VALIDATION (Validate pricing lists, active SKU flags, credit checks)
       │
       ▼
8. CONFIDENCE SCORING (Evaluate product match score and LLM output token probabilities)
       │
       ▼
9. ROUTE DECISION
     ├── Confidence >= 90% ──► Create Draft Order & Auto-Confirm
     └── Confidence < 90%  ──► Route to Dashboard Human Review Queue
```

---

## 2. Pipeline Step Specifications

### 1. Ingestion & Deduplication

- **Input**: Raw JSON payload from the WhatsApp Business API webhook.
- **Verification**: Validates signature using the HMAC secret. Deduplicates requests by matching `message_sid` inside a 5-minute Redis window.

### 2. Normalization & Preprocessing

- Strips non-standard characters, normalizes line breaks.
- If the incoming message is an audio attachment, the worker downloads the binary and dispatches it to a transcription service (Whisper API) to return textual data.

### 3. Language & Dialect Detection

- Identifies whether the chat uses standard English, Hindi (Devanagari), or Hinglish (Hindi written in the Latin alphabet, e.g., _"Bhaiya 10 case Parle-G bhej do"_).
- Attaches language tags to customize prompt instructions for the LLM.

### 4. Vector Product Retrieval (RAG Candidate Injection)

- Raw messages rarely use exact SKU names. Instead of passing the entire product catalog (which could blow the context window), the system tokenizes the message and queries the PostgreSQL vector database (`pgvector` indexes).
- Retrieves the top 15 most similar products based on cosine distance.
- Passes this candidate list (SKU, name, MRP, unit) as context to the LLM.

### 5. LLM Structured Extraction (JSON Schema)

- Invokes the LLM (e.g., GPT-4o-mini or Claude 3.5 Haiku) with strict JSON output configuration.
- **Prompt Structure**:
  ```text
  You are an expert order processing clerk. Parse the customer message and match items to the Candidate Products list.

  Candidate Products:
  {candidate_products_json}

  Customer Message:
  "{message_text}"

  Return a JSON object conforming strictly to the requested schema. Do not include markdown code block syntax.
  ```

### 6. Zod Verification & Business Rules

- Matches the output against the shared Zod schema `packages/validation/src/order-parser.ts`.
- Validates structural shapes.
- Business rules check:
  - If a matched product is marked inactive.
  - If the requested quantity exceeds available stock levels.

### 7. Confidence Engine

- Computes an aggregate score out of 100 based on:
  - Vector similarity metric matches for the selected SKUs.
  - The model's token match score.
  - If any product could not be mapped to any SKU (unmapped text remains).
- **Thresholding**:
  - Score $\geq 90\%$: Draft order created and approved.
  - Score $< 90\%$: Order created in state `PENDING_REVIEW` and flagged.

---

## 3. Operational Costs & Cost Auditing

- Input and output tokens are logged upon every invocation.
- Cost records are saved under `ai_extractions.token_cost`.
- Aggregates can be monitored on the system dashboard to audit LLM vendor costs against the organization's monthly SaaS subscription limits.
