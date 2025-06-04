'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateSeedPhrase, saveSeedPhrase } from '@/lib/auth';
import toast from 'react-hot-toast';
import { Icon } from '@iconify/react/dist/iconify.js';

const SeedPhrasePage = () => {
    const router = useRouter();
    const [phrase, setPhrase] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const email = sessionStorage.getItem('userEmail');

        if (!email) {
            toast.error('No email found. Redirecting...');
            router.push('/create-wallet');
            return;
        }

        (async () => {
            try {
                const res = await generateSeedPhrase();
                setPhrase(res.phrase);
            } catch (error) {
                toast.error('Failed to generate seed phrase please Try again later or reload page');
                console.error(error);
            } finally {
                setLoading(false);
            }
        })();
    });

    const handleCopy = () => {
        navigator.clipboard.writeText(phrase);
        toast.success('Seed phrase copied!');
    };

    const handleConfirm = async () => {
        const email = sessionStorage.getItem('userEmail')!;
        
        try {
            await saveSeedPhrase(email, phrase);
            toast.success('Seed saved!');
            router.push('/login');
        } catch (error) {
            console.error(error);
            toast.error('Failed to save seed phrase');
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white px-4">
            <div className="bg-[#1E1E1E] p-3 py-8 rounded-lg max-w-md w-full text-center shadow-md">
                <h1 className="text-2xl font-bold mb-4 text-yellow-400">Your Seed Phrase</h1>

                {loading ? (
                    <p className="text-gray-400">Generating...</p>
                ) : (
                    <>
                        <div className="grid grid-cols-3 gap-2 bg-[#2A2A2A] p-2 rounded mb-4">
                            {phrase.split(' ').map((word, index) => (
                                <div
                                    key={index}
                                    className="bg-[#1E1E1E] text-yellow-400 px-2 py-2 rounded text-sm font-mono text-left border border-[#ebb70c]"
                                >
                                    {word}
                                </div>
                            ))}
                        </div>


                        <button
                            onClick={handleCopy}
                            className="bg-[#ebb70c] px-4 py-2 rounded mb-4 hover:scale-105 transition text-white text-[14px] font-semibold flex gap-2 items-center justify-center mx-auto"
                        >
                            Copy Phrase <Icon icon="carbon:copy" width="26" height="26" />
                        </button>

                        <div className="text-left text-xs text-gray-300 bg-[#2a2a2a] p-3 rounded mb-6">
                            <p className="mb-2 font-semibold text-red-400">⚠️ Important Notice:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>This seed phrase is your <strong>permanent login password</strong>.</li>
                                <li>Store it securely — if lost, your access cannot be recovered.</li>
                                <li>Do not share this phrase with anyone!</li>
                            </ul>
                        </div>

                        <button
                            onClick={handleConfirm}
                            className="w-full bg-[#ebb70c] px-6 py-2 rounded hover:scale-105 transition font-semibold text-white"
                        >
                            I’ve Saved It – Continue
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default SeedPhrasePage;
// function saveSeedPhrase(email: string, phrase: string) {
//     throw new Error('Function not implemented.');
// }

