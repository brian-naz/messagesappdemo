export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="px-4 py-2 rounded-2xl bg-white/20 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 flex gap-1">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
      </div>
    </div>
  );
}
