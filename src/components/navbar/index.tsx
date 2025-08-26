// components/Navbar.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import {
  FaHome,
  FaList,
  FaMapMarkerAlt,
  FaUsers,
  FaTachometerAlt,
  FaChartLine,
  FaUserCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-blue-500 text-white shadow-md px-4">
      <div className=" w-full  mx-auto px-4 flex justify-between items-center h-18">
        {/* Logo + Título */}
        <div className="flex items-center gap-3">
          <img
            src="/logo.png" // coloque sua logo na pasta public
            alt="Logo"
            className="h-8 w-8"
          />
          <span className="font-bold text-lg">Sistema de Fiscalização</span>
        </div>

        {/* Menu Desktop */}
        <div className="hidden text-lg lg:flex gap-6 items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80">
            <FaHome /> Início
          </Link>
          <Link
            href="/alvos"
            className="flex items-center gap-2 hover:opacity-80"
          >
            <FaList /> Minhas Fiscalizacoes
          </Link>
          <Link
            href="/mapa"
            className="flex items-center gap-2 hover:opacity-80"
          >
            <FaMapMarkerAlt /> Mapa
          </Link>
          <Link
            href="/equipes"
            className="flex items-center gap-2 hover:opacity-80"
          >
            <FaUsers /> Equipes
          </Link>
          <Link
            href="/pages/dashboard"
            className="flex items-center gap-2 hover:opacity-80"
          >
            <FaTachometerAlt /> Dashboard
          </Link>
       
       
        </div>
        <div className="flex text-lg items-center gap-2 cursor-pointer hover:opacity-80">
            <FaUserCircle /> 
            {user?.name} ▾
          </div>

        {/* Botão Mobile */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Menu Mobile */}
      {menuOpen && (
        <div className="lg:hidden bg-gradient-to-b from-blue-800 to-blue-600 p-6 space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <FaHome /> Início
          </Link>
          <Link href="/alvos" className="flex items-center gap-2">
            <FaList /> Minhas Fiscalizacoes
          </Link>
          <Link href="/mapa" className="flex items-center gap-2">
            <FaMapMarkerAlt /> Mapa
          </Link>
          <Link href="/equipes" className="flex items-center gap-2">
            <FaUsers /> Equipes
          </Link>
          <Link href="/dashboard" className="flex items-center gap-2">
            <FaTachometerAlt /> Dashboard
          </Link>
         
          <div className="flex items-center gap-2 cursor-pointer">
            <FaUserCircle /> Juliano Barbosa ▾
          </div>
        </div>
      )}
    </nav>
  );
}
