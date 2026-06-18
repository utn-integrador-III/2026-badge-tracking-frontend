'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/auth-store';

interface PinScreenProps {
  mode?: 'setup' | 'auth';
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PinScreen({ mode = 'auth', onSuccess, onCancel }: PinScreenProps) {
  const { setPin, authenticate, pin: storedPin, resetAuth } = useAuthStore();
  
  // Internal step for setup: 'enter' (initial pin) or 'confirm' (confirmation pin)
  const [setupStep, setSetupStep] = useState<'enter' | 'confirm'>('enter');
  const [tempPin, setTempPin] = useState<string>('');
  
  const [inputPin, setInputPin] = useState<string>('');
  const [showPin, setShowPin] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState<boolean>(false);
  
  // If in auth mode, but there is no PIN, switch to setup mode
  const currentMode = mode === 'auth' && !storedPin ? 'setup' : mode;

  // Clear errors when typing
  useEffect(() => {
    if (error) setError(null);
  }, [inputPin]);

  const handleKeyPress = (num: number) => {
    if (inputPin.length < 6) {
      setInputPin(prev => prev + num);
    }
  };

  const handleBackspace = () => {
    setInputPin(prev => prev.slice(0, -1));
  };

  // Watch for 6-digit complete input
  useEffect(() => {
    if (inputPin.length === 6) {
      // Small timeout for visual confirmation of the last dot
      const timer = setTimeout(() => {
        handlePinSubmit(inputPin);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [inputPin]);

  const triggerErrorAnimation = (message: string) => {
    setError(message);
    setShake(true);
    setInputPin('');
    // Reset shake class after animation completes (0.4s)
    setTimeout(() => {
      setShake(false);
    }, 400);
  };

  const handlePinSubmit = (val: string) => {
    if (currentMode === 'setup') {
      if (setupStep === 'enter') {
        setTempPin(val);
        setSetupStep('confirm');
        setInputPin('');
      } else {
        // Confirm step
        if (val === tempPin) {
          setPin(val);
          if (onSuccess) onSuccess();
        } else {
          triggerErrorAnimation('Los PIN no coinciden. Inténtalo de nuevo.');
          setSetupStep('enter');
          setTempPin('');
        }
      }
    } else {
      // Auth mode
      const success = authenticate(val);
      if (success) {
        if (onSuccess) onSuccess();
      } else {
        triggerErrorAnimation('PIN incorrecto. Inténtalo de nuevo.');
      }
    }
  };

  const getTitleAndSubtitle = () => {
    if (currentMode === 'setup') {
      if (setupStep === 'enter') {
        return {
          title: 'Crear PIN de acceso',
          subtitle: 'Hola Juan, establece un PIN de 6 dígitos'
        };
      } else {
        return {
          title: 'Confirmar PIN de acceso',
          subtitle: 'Por favor, confirma tu PIN de 6 dígitos'
        };
      }
    } else {
      return {
        title: 'Ingresar PIN de acceso',
        subtitle: 'Hola Juan, introduce tu PIN de 6 dígitos para ingresar'
      };
    }
  };

  const { title, subtitle } = getTitleAndSubtitle();

  const handleBackLink = () => {
    if (currentMode === 'setup' && setupStep === 'confirm') {
      setSetupStep('enter');
      setTempPin('');
      setInputPin('');
      return;
    }
    
    if (onCancel) {
      onCancel();
    } else {
      // Default: Reset auth state to clear the flow
      resetAuth();
      setInputPin('');
      setSetupStep('enter');
      setTempPin('');
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-slate-50 text-slate-800 max-w-md mx-auto shadow-2xl relative overflow-hidden select-none">
      {/* Top Banner (Dark Blue Section) */}
      <div className="bg-gradient-to-b from-[#1B3A8C] to-[#162f73] px-6 pt-12 pb-8 flex flex-col items-center justify-center text-white text-center shadow-lg rounded-b-[2.5rem]">
        {/* UTN Logo Container */}
        <div className="bg-white p-3.5 rounded-2xl shadow-md flex items-center justify-center w-24 h-24 mb-6 hover:scale-105 transition-transform duration-200">
          <Image 
            src="/brand/logo.png" 
            alt="UTN Logo" 
            width={72} 
            height={72} 
            priority
            className="object-contain"
          />
        </div>

        {/* Shield Icon Badge */}
        <div className="w-11 h-11 bg-white/15 rounded-full flex items-center justify-center mb-4 border border-white/30 shadow-inner">
          <ShieldCheck className="h-5 w-5 text-white" aria-hidden />
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-2xl font-bold tracking-wide transition-all duration-300">
          {title}
        </h1>
        <p className="mt-1 text-slate-300 text-sm font-light max-w-xs transition-all duration-300">
          {subtitle}
        </p>
      </div>

      {/* Bottom Input & Keypad Section */}
      <div className="flex-1 flex flex-col justify-between px-6 pt-10 pb-8">
        
        {/* Indicators and Toggle Display */}
        <div className="flex flex-col items-center gap-4">
          {/* Indicators container (shakes on error) */}
          <div className={`flex justify-center items-center gap-5 py-2 ${shake ? 'animate-shake' : ''}`}>
            {Array.from({ length: 6 }).map((_, index) => {
              const hasValue = index < inputPin.length;
              return (
                <div
                  key={index}
                  className={`
                    rounded-full flex items-center justify-center transition-all duration-200
                    ${hasValue
                      ? showPin
                        ? 'w-9 h-9 bg-[#4A90E2] border-2 border-[#4A90E2] shadow-[0_0_12px_rgba(74,144,226,0.5)] scale-105'
                        : 'w-5 h-5 bg-[#4A90E2] shadow-[0_0_8px_rgba(74,144,226,0.4)] scale-110'
                      : 'w-5 h-5 border-2 border-slate-400 bg-transparent'
                    }
                  `}
                >
                  {hasValue && showPin && (
                    <span className="text-white font-bold text-sm leading-none select-none">
                      {inputPin[index]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Toggle PIN Visibility Button */}
          <button 
            type="button" 
            onClick={() => setShowPin(!showPin)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-500 hover:text-brand-700 hover:bg-brand-50/50 active:scale-95 transition-all duration-200 mt-1"
          >
            {showPin ? (
              <>
                <EyeOff className="h-4 w-4" />
                <span>Ocultar PIN</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                <span>Mostrar PIN</span>
              </>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <span className="text-red-500 text-xs font-semibold mt-1 animate-pulse">
              {error}
            </span>
          )}
        </div>

        {/* Custom Numeric Keypad */}
        <div className="w-full max-w-xs mx-auto my-auto py-4">
          <div className="grid grid-cols-3 gap-x-6 gap-y-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeyPress(num)}
                className="flex items-center justify-center aspect-square h-14 w-full rounded-2xl bg-white text-2xl font-bold text-brand-950 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100/50 active:scale-90 active:bg-slate-100 hover:shadow-md hover:border-slate-200/50 hover:bg-slate-50/50 transition-all duration-150 cursor-pointer select-none"
              >
                {num}
              </button>
            ))}

            {/* Bottom Row: Empty, 0, Backspace */}
            <div className="w-full h-14" /> {/* Empty spacing */}
            
            <button
              type="button"
              onClick={() => handleKeyPress(0)}
              className="flex items-center justify-center aspect-square h-14 w-full rounded-2xl bg-white text-2xl font-bold text-brand-950 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100/50 active:scale-90 active:bg-slate-100 hover:shadow-md hover:border-slate-200/50 hover:bg-slate-50/50 transition-all duration-150 cursor-pointer select-none"
            >
              0
            </button>

            <button
              type="button"
              onClick={handleBackspace}
              disabled={inputPin.length === 0}
              className="flex items-center justify-center h-14 w-full rounded-2xl text-slate-400 hover:text-slate-600 hover:bg-slate-100/30 active:scale-90 disabled:opacity-30 disabled:pointer-events-none transition-all duration-150 cursor-pointer select-none"
            >
              {/* Custom High-Fidelity Backspace Icon path */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Volver al registro / Cancel link */}
        <div className="text-center mt-2">
          <button
            type="button"
            onClick={handleBackLink}
            className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-brand-700 hover:translate-x-[-2px] transition-all duration-200"
          >
            ← Volver al registro
          </button>
        </div>
      </div>
    </div>
  );
}
