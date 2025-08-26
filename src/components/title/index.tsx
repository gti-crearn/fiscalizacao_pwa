// components/DashboardHeader.tsx
"use client";
import { ReactNode } from "react";
import { ButtonComponent } from "../button";

interface ActionButton {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  color?: "blue" | "green" | "red" | "gray";
}

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  actions?: ActionButton[];
}

export default function DashboardHeader({
  title,
  subtitle,
  actions = [],
}: DashboardHeaderProps) {
  const colors = {
    blue: "border-blue-600 text-blue-600 hover:bg-blue-50",
    green: "border-green-600 text-green-600 hover:bg-green-50",
    red: "border-red-600 text-red-600 hover:bg-red-50",
    gray: "border-gray-600 text-gray-600 hover:bg-gray-50",
  };


  return (
    <div className="flex  md:flex-row justify-between items-center md:items-center bg-gray-100 px-4 md:px-6 py-2 border-b border-gray-300">
      {/* Título e Subtítulo */}
      <div>
        <h1 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
          {title}
        </h1>
        <p className="text-sm sm:text-base md:text-md text-gray-600">
          {subtitle}
        </p>
      </div>

      {/* Botões de ação */}
      <div className="flex flex-wrap gap-2">
        {actions.map((btn, i) => (
          <ButtonComponent
            key={i}
            onClick={btn.onClick}
            variant={btn.color}
          >
            {btn.icon}
            {btn.label}
          </ButtonComponent>
        ))}
      </div>
    </div>
  );
}
