'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function ESRegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    companyName: '',
    jobType: '',
    graduationYear: '',
    esFormat: '',
    esTheme: '',
    importantPoints: '',
    preparationMethods: ''
  });

  const graduationYears = ['2025年卒', '2026年卒', '2027年卒'];
  const esFormats = ['履歴書の提出', 'フォームの回答'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('認証されていません');

      const { error } = await supabase.from('es_entries_syukatu').insert([
        {
          user_id: user.id,
          company_name: formData.companyName,
          job_type: formData.jobType,
          graduation_year: formData.graduationYear,
          es_format: formData.esFormat,
          es_theme: formData.esTheme,
          important_points: formData.importantPoints,
          preparation_methods: formData.preparationMethods
        }
      ]);

      if (error) throw error;

      router.push('/es');
    } catch (error) {
      console.error('Error:', error);
      setErrorMsg('登録に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                ES情報登録
              </h1>
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                戻る
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 required-label">
                  会社名
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.companyName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 required-label">
                  選考職種
                </label>
                <input
                  type="text"
                  id="jobType"
                  name="jobType"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.jobType}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700 required-label">
                  卒業年度
                </label>
                <select
                  id="graduationYear"
                  name="graduationYear"
                  required
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                  value={formData.graduationYear}
                  onChange={handleChange}
                >
                  <option value="">選択してください</option>
                  {graduationYears.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="esFormat" className="block text-sm font-medium text-gray-700 required-label">
                  ESの形式
                </label>
                <select
                  id="esFormat"
                  name="esFormat"
                  required
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                  value={formData.esFormat}
                  onChange={handleChange}
                >
                  <option value="">選択してください</option>
                  {esFormats.map((format) => (
                    <option key={format} value={format}>{format}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="esTheme" className="block text-sm font-medium text-gray-700 required-label">
                  ESの内容・テーマ
                </label>
                <textarea
                  id="esTheme"
                  name="esTheme"
                  required
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.esTheme}
                  onChange={handleChange}
                  placeholder="例: 学生時代に力を入れたこと、自己PR、志望動機など"
                />
              </div>

              <div>
                <label htmlFor="importantPoints" className="block text-sm font-medium text-gray-700 required-label">
                  ESを書くときに注意したこと
                </label>
                <textarea
                  id="importantPoints"
                  name="importantPoints"
                  required
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.importantPoints}
                  onChange={handleChange}
                  placeholder="例: 結果と数値を具体的に記載、自分の強みを明確に表現など"
                />
              </div>

              <div>
                <label htmlFor="preparationMethods" className="block text-sm font-medium text-gray-700 required-label">
                  ES対策で行ったこと
                </label>
                <textarea
                  id="preparationMethods"
                  name="preparationMethods"
                  required
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.preparationMethods}
                  onChange={handleChange}
                  placeholder="例: OB・OG訪問で業界研究、インターンシップ参加、自己分析ワークなど"
                />
              </div>

              {errorMsg && (
                <div className="text-red-600 text-sm text-center">
                  {errorMsg}
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                    isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  {isSubmitting ? '登録中...' : '登録する'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .required-label::after {
          content: " *";
          color: #ef4444;
        }
      `}</style>
    </div>
  );
}