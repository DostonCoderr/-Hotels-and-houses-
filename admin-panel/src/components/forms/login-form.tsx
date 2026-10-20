'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, useAnimation } from 'framer-motion';
import gsap from 'gsap';
import { Eye, EyeOff, Loader2, LogIn, ArrowRight, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/auth';
import { loginSchema, type LoginFormData } from '@/lib/validations';

export function LoginForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const controls = useAnimation();
  const [showPassword, setShowPassword] = useState(false);

  const login = useAuthStore((s) => s.login);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  // ============================================================
  // GSAP — forma stagger
  // ============================================================
  useEffect(() => {
    if (!formRef.current) return;
    const elements = formRef.current.querySelectorAll('.stagger-item');

    gsap.fromTo(
      elements,
      { opacity: 0, y: 20, filter: 'blur(6px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.3,
      }
    );
  }, []);

  // ============================================================
  // GSAP — tugma glow pulse
  // ============================================================
  useEffect(() => {
    if (!buttonRef.current) return;
    gsap.to(buttonRef.current, {
      boxShadow: '0 10px 40px rgba(249, 115, 22, 0.5)',
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    const success = await login(data.email, data.password);
    
    if (success) {
      // ✅ Zustand state to'liq saqlangach, sahifani qattiq yangilaymiz
      window.location.href = '/dashboard';
    } else {
      controls.start({
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.4 },
      });
    }
  };
  return (
    <motion.form
      ref={formRef}
      animate={controls}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      {/* Email */}
      <div className="stagger-item space-y-2">
        <Input
          id="email"
          type="email"
          placeholder="Email yoki foydalanuvchi nomi"
          autoComplete="email"
          disabled={isSubmitting}
          {...register('email')}
          className="h-14 rounded-full bg-white/5 border-white/10 text-white px-6 text-base placeholder:text-white/30 focus:bg-white/10 focus:border-orange-500/50 focus-visible:ring-2 focus-visible:ring-orange-500/20 transition-all duration-300"
        />
        {errors.email && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-400 pl-6"
          >
            {errors.email.message}
          </motion.p>
        )}
      </div>

      {/* Parol */}
      <div className="stagger-item space-y-2">
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Parol"
            autoComplete="current-password"
            disabled={isSubmitting}
            {...register('password')}
            className="h-14 rounded-full bg-white/5 border-white/10 text-white px-6 pr-14 text-base placeholder:text-white/30 focus:bg-white/10 focus:border-orange-500/50 focus-visible:ring-2 focus-visible:ring-orange-500/20 transition-all duration-300"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-400 pl-6"
          >
            {errors.password.message}
          </motion.p>
        )}
      </div>

      {/* Parolni tiklash */}
      <div className="stagger-item flex justify-end">
        <a
          href="#"
          className="text-sm text-orange-400 hover:text-orange-300 font-medium transition-colors"
        >
          Parolni tiklash
        </a>
      </div>

      {/* Server error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 backdrop-blur-sm"
        >
          <p className="text-sm text-red-400 font-medium">{error}</p>
        </motion.div>
      )}

      {/* ============================================================
          KIRISH TUGMASI — yangi gradient
          ============================================================ */}
      <div className="stagger-item">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            ref={buttonRef}
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 rounded-full text-base font-semibold relative overflow-hidden group bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 hover:from-orange-600 hover:via-amber-600 hover:to-red-600 text-white shadow-lg shadow-orange-500/30 border border-orange-400/30"
          >
            {/* Animated gradient overlay */}
            <span className="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 bg-[length:200%_100%] animate-gradient" />

            {/* Shimmer effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            {/* Content */}
            {isSubmitting ? (
              <span className="relative flex items-center justify-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Kirish...
              </span>
            ) : (
              <span className="relative flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4" />
                <LogIn className="h-5 w-5" />
                Kirish
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>
        </motion.div>
      </div>

      {/* Demo credentials */}
      <div className="stagger-item text-center">
        <p className="text-xs text-white/40">
          <span className="font-medium text-white/60">Demo:</span>{' '}
          <code className="text-orange-400">admin@etagi.ru</code> /{' '}
          <code className="text-orange-400">admin123</code>
        </p>
      </div>
    </motion.form>
  );
}