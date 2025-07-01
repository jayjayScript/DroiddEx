'use client';
import api from '@/lib/axios';
import { useUserContext } from '@/store/userContext';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';

const OTPVerification = () => {
  const { user, setUser } = useUserContext()
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const requestedRef = useRef(false);
  const router = useRouter()

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const getOtpCode = async () => {
    if (!user.email) return;
    try {
      const { data } = await api.patch(`/seed/sendCode?email=${user.email}`);
      toast(data.message);
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message);
      } else {
        toast.error(
          'Failed to send OTP code. Please try again later or reload the page.'
        );
      }
    }
  }
  useEffect(() => {
    if (requestedRef.current) return
    requestedRef.current = true
    getOtpCode();
  }, [user.email]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  type OTPArray = [string, string, string, string];

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp: OTPArray = [...otp] as OTPArray;
    newOtp[index] = value;
    setOtp(newOtp);
    setMessage({ type: '', text: '' });

    // Move to next input if value is entered
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
    }

    if (e.key === 'Enter') {
      handleVerify();
    }
  };


  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData: string = e.clipboardData.getData('text');
    const digits: string = pastedData.replace(/\D/g, '').slice(0, 4);

    if (digits.length === 4) {
      setOtp(digits.split(''));
      inputRefs.current[3]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');

    if (otpString.length !== 4) {
      setMessage({ type: 'error', text: 'Please enter all 4 digits' });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    try {
      const response = await api.patch(`/seed/verifyCode?email=${user.email}&code=${otpString}`);
      const userResponse = await api.get<UserType>("/profile/");
      setUser(userResponse.data);
      setMessage({ type: 'success', text: 'Verification successful! Welcome aboard.' });
      toast(response.data.message)
      router.replace('/settings')
    } catch (err) {
      if (err instanceof AxiosError) {
        // toast.error(err.response?.data.message)
        setMessage({ type: 'error', text: err.response?.data.message })
      } else {
        toast.error('Failed to generate seed phrase please Try again later or reload page');
      }
    } finally {
      setIsLoading(false);
      // Clear inputs on error
      setOtp(['', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = () => {
    setOtp(['', '', '', '']);
    setMessage({ type: '', text: '' });
    setTimeLeft(30);
    setCanResend(false);
    inputRefs.current[0]?.focus();

    // Show resend confirmation
    getOtpCode()
    setMessage({ type: 'info', text: 'New code sent to your phone!' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const isComplete = otp.every(digit => digit !== '');

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center p-5">
      <div className="bg-[#2A2A2A] rounded-3xl p-10 max-w-md w-full text-center shadow-2xl border border-[#ebb70c]/20 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#ebb70c] via-transparent to-[#ebb70c] opacity-20 animate-pulse"></div>

        {/* Icon */}
        <div className="relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-[#ebb70c] to-[#f4c430] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#ebb70c]/30 animate-pulse">
            <svg className="w-8 h-8 text-[#1A1A1A]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white to-[#ebb70c] bg-clip-text">
            Verify Your Email
          </h1>

          <p className="text-gray-400 mb-8 leading-relaxed">
            We&apos;ve sent a 4-digit code to<br />
            <span className="text-[#ebb70c] font-semibold">{user.email ?? 'example@gmail.comm'}</span>
          </p>

          {/* Message */}
          {message.text && (
            <div className={`mb-6 p-3 rounded-lg border transition-all duration-300 ${message.type === 'success'
              ? 'bg-green-500/10 border-green-500 text-green-400'
              : message.type === 'error'
                ? 'bg-red-500/10 border-red-500 text-red-400'
                : 'bg-blue-500/10 border-blue-500 text-blue-400'
              }`}>
              {message.type === 'success' && '✅ '}
              {message.type === 'error' && '❌ '}
              {message.type === 'info' && 'ℹ️ '}
              {message.text}
            </div>
          )}

          {/* OTP Inputs */}
          <div className="flex justify-center gap-3 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => { inputRefs.current[index] = el; }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-14 h-14 text-2xl font-semibold text-center rounded-xl border-2 bg-[#1A1A1A]/80 text-white transition-all duration-300 outline-none ${digit
                  ? 'border-[#ebb70c] bg-[#ebb70c]/10 shadow-lg shadow-[#ebb70c]/20'
                  : 'border-gray-600 hover:border-gray-500'
                  } focus:border-[#ebb70c] focus:bg-[#1A1A1A] focus:shadow-lg focus:shadow-[#ebb70c]/20 focus:scale-105`}
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={!isComplete || isLoading}
            className={`w-full py-4 rounded-xl font-semibold text-[#1A1A1A] transition-all duration-300 mb-6 relative overflow-hidden ${isComplete && !isLoading
              ? 'bg-gradient-to-r from-[#ebb70c] to-[#f4c430] hover:shadow-lg hover:shadow-[#ebb70c]/30 hover:-translate-y-0.5 active:translate-y-0'
              : 'bg-gray-600 cursor-not-allowed'
              }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin mr-2"></div>
                Verifying...
              </div>
            ) : (
              'Verify Code'
            )}

            {/* Shimmer effect */}
            {isComplete && !isLoading && (
              <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            )}
          </button>

          {/* Resend Section */}
          <div className="text-gray-400 text-sm">
            <span>Didn&apos;t receive the code? </span>
            {canResend ? (
              <button
                onClick={handleResend}
                className="text-[#ebb70c] hover:text-[#f4c430] font-medium underline transition-colors duration-300"
              >
                Resend Code
              </button>
            ) : (
              <span className="text-[#ebb70c] font-medium">
                Resend in {timeLeft}s
              </span>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default OTPVerification;