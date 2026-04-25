interface StepItemProps {
  number: number;
  title: string;
  description: React.ReactNode;
  isLast?: boolean;
}

export default function StepItem({
  number,
  title,
  description,
  isLast = false,
}: StepItemProps) {
  return (
    <div className="flex gap-3.5">
      <div className="flex flex-col items-center w-8 flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-blue-700 text-white text-sm font-bold flex items-center justify-center z-10">
          {number}
        </div>
        {!isLast && <div className="flex-1 w-0.5 bg-blue-100 my-1 min-h-4" />}
      </div>
      <div className={`flex-1 ${isLast ? "pb-0" : "pb-5"}`}>
        <p className="text-sm font-semibold text-gray-900 mb-1 leading-snug">
          {title}
        </p>
        <div className="text-[13px] text-gray-500 leading-relaxed">
          {description}
        </div>
      </div>
    </div>
  );
}
