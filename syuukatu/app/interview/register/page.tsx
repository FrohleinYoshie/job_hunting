'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function InterviewRegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    companyName: '',
    jobType: '',
    graduationYear: '',
    interviewType: '',
    interviewDuration: '',
    interviewFormat: '',
    numOfInterviewers: '',
    questions: '',
    atmosphere: '',
    preparationMethods: '',
    advice: ''
  });

  const graduationYears = ['2025年卒', '2026年卒', '2027年卒'];
  const interviewTypes = ['1次面接', '2次面接', '3次面接', '最終面接', 'カジュアル面談'];
  const interviewFormats = ['対面', 'オンライン', 'ハイブリッド'];
  const durations = ['30分', '45分', '60分', '90分', '120分', '120分以上'];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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

      const { error } = await supabase.from('interviews_syukatu').insert([
        {
          user_id: user.id,
          company_name: formData.companyName,
          job_type: formData.jobType,
          graduation_year: formData.graduationYear,
          interview_type: formData.interviewType,
          interview_duration: formData.interviewDuration,
          interview_format: formData.interviewFormat,
          num_of_interviewers: parseInt(formData.numOfInterviewers),
          questions: formData.questions,
          atmosphere: formData.atmosphere,
          preparation_methods: formData.preparationMethods,
          advice: formData.advice
        }
      ]);

      if (error) throw error;

      router.push('/interview');
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
                面接情報登録
              </h1>
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
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
                <label htmlFor="interviewType" className="block text-sm font-medium text-gray-700 required-label">
                  面接種別
                </label>
                <select
                  id="interviewType"
                  name="interviewType"
                  required
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                  value={formData.interviewType}
                  onChange={handleChange}
                >
                  <option value="">選択してください</option>
                  {interviewTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="interviewFormat" className="block text-sm font-medium text-gray-700 required-label">
                  面接形式
                </label>
                <select
                  id="interviewFormat"
                  name="interviewFormat"
                  required
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                  value={formData.interviewFormat}
                  onChange={handleChange}
                >
                  <option value="">選択してください</option>
                  {interviewFormats.map((format) => (
                    <option key={format} value={format}>{format}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="interviewDuration" className="block text-sm font-medium text-gray-700 required-label">
                  面接時間
                </label>
                <select
                  id="interviewDuration"
                  name="interviewDuration"
                  required
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                  value={formData.interviewDuration}
                  onChange={handleChange}
                >
                  <option value="">選択してください</option>
                  {durations.map((duration) => (
                    <option key={duration} value={duration}>{duration}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="numOfInterviewers" className="block text-sm font-medium text-gray-700 required-label">
                  面接官の人数
                </label>
                <input
                  type="number"
                  id="numOfInterviewers"
                  name="numOfInterviewers"
                  required
                  min="1"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.numOfInterviewers}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="questions" className="block text-sm font-medium text-gray-700 required-label">
                  質問内容
                </label>
                <textarea
                  id="questions"
                  name="questions"
                  required
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.questions}
                  onChange={handleChange}
                  placeholder="面接で聞かれた質問を記入してください"
                />
              </div>

              <div>
                <label htmlFor="atmosphere" className="block text-sm font-medium text-gray-700 required-label">
                  面接の雰囲気
                </label>
                <textarea
                  id="atmosphere"
                  name="atmosphere"
                  required
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.atmosphere}
                  onChange={handleChange}
                  placeholder="面接の雰囲気について記入してください"
                />
              </div>

              <div>
                <label htmlFor="preparationMethods" className="block text-sm font-medium text-gray-700 required-label">
                  準備方法・対策
                </label>
                <textarea
                  id="preparationMethods"
                  name="preparationMethods"
                  required
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.preparationMethods}
                  onChange={handleChange}
                  placeholder="面接対策として行ったことを記入してください"
                />
              </div>

              <div>
                <label htmlFor="advice" className="block text-sm font-medium text-gray-700">
                  アドバイス・補足
                </label>
                <textarea
                  id="advice"
                  name="advice"
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.advice}
                  onChange={handleChange}
                  placeholder="後輩へのアドバイスや補足事項があれば記入してください"
                />
              </div>

              {errorMsg && (
                <div className="text-red-600 text-sm text-center">
                  {errorMsg}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                    isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
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