/**
 * Fables Flow — Background Worker
 *
 * Processes BullMQ jobs: AI parsing, invoice PDFs, reminders, reports.
 * Queue processors will be registered here in future milestones.
 */

function handleShutdown(signal: string): void {
  console.log(`[worker] received ${signal}, shutting down gracefully...`);
  process.exit(0);
}

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

console.log('[worker] Fables Flow worker started');
console.log('[worker] No queue processors registered yet — awaiting future milestones');
