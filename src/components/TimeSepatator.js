const TimeSeparator = ({ timestamp }) => {
  const date = new Date(timestamp);
  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  const startOfYesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1,
  );

  let label;

  if (date >= startOfToday) {
    label = `Today ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  } else if (date >= startOfYesterday) {
    label = `Yesterday at ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  } else {
    label = `${date.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    })} at ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  return (
    <div className="flex justify-center my-4">
      <div
        className="
          text-[10px]
          text-zinc-500 dark:text-zinc-400
        "
      >
        {label}
      </div>
    </div>
  );
};

export default TimeSeparator;
