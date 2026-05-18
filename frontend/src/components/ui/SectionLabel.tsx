interface Props { children: string; center?: boolean; }

export default function SectionLabel({ children, center }: Props) {
  return (
    <div className={`flex items-center gap-3 mb-3 ${center ? "justify-center" : ""}`}>
      {!center && <span className="w-5 h-0.5 bg-gold rounded-full flex-shrink-0" />}
      <span className="text-gold text-xs font-bold tracking-[0.18em] uppercase font-sans">
        {children}
      </span>
      {center && <span className="w-5 h-0.5 bg-gold rounded-full flex-shrink-0" />}
    </div>
  );
}
