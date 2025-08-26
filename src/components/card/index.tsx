// components/StatCard.tsx
import { ReactNode } from "react";

interface CardProps {
  value: number | string;
  label: string;
  bgColor: string; // classes do Tailwind ex: "bg-blue-600"
  icon?: ReactNode;
  toColor:string
}

export default function Card({ value, label, bgColor, icon, toColor }: CardProps) {
  return (
    <div
      className={`${bgColor} bg-gradient-to-r ${toColor}  flex items-center justify-between p-6 rounded-lg shadow-md text-white w-full`}
    >
      <div>
        <h2 className="text-4xl font-bold ">{value}</h2>
        <p className="text-lg font-medium">{label}</p>
      </div>
      <div className="text-4xl opacity-90">{icon}</div>
    </div>
  );
}
