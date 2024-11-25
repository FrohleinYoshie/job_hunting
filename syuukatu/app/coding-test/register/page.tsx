'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function CodingTestRegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    companyName: '',
    jobType: '',
    graduationYear: '',
    testDifficulty: '',
    testFormat: '',
    testDuration: '',
    programmingLanguages: [] as string[],
    testContents: '',
    preparationMethods: '',
    advice: ''
  });

  const difficultyLevels = ['易しい', '普通', '難しい', 'とても難しい'];
  const testFormats = ['コーディング形式', '選択形式', '記述形式', '複合形式'];
  const durations = ['30分', '45分', '60分', '90分', '120分', '120分以上'];
  const programmingLanguageOptions = [
    'Java', 'Python', 'C++', 'JavaScript', 'TypeScript', 'C#',
    'Ruby', 'Go', 'Swift', 'Kotlin', 'PHP', 'その他'
  ];
  const graduationYears = ['2025年卒', '2026年卒', '2027年卒'];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLanguageChange = (language: string) => {
    setFormData(prev => ({
      ...prev,
      programmingLanguages: prev.programmingLanguages.includes(language)
        ? prev.programmingLanguages.filter(l => l !== language)
        : [...prev.programmingLanguages, language]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('認証されていません');

      const { error } = await supabase.from('coding_tests_syukatu').insert([
        {
          user_id: user.id,
          company_name: formData.companyName,
          job_type: formData.jobType,
          graduation_year: formData.graduationYear,
          test_difficulty: formData.testDifficulty,
          test_format: formData.testFormat,
          test_duration: formData.testDuration,
          programming_languages: formData.programmingLanguages,
          test_contents: formData.testContents,
          preparation_methods: formData.preparationMethods,
          advice: formData.advice
        }
      ]);

      if (error) throw error;

      router.push('/coding-test');
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
                コーディングテスト情報登録
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
                <label htmlFor="testDifficulty" className="block text-sm font-medium text-gray-700 required-label">
                  テストの難易度
                </label>
                <select
                  id="testDifficulty"
                  name="testDifficulty"
                  required
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                  value={formData.testDifficulty}
                  onChange={handleChange}
                >
                  <option value="">選択してください</option>
                  {difficultyLevels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="testFormat" className="block text-sm font-medium text-gray-700 required-label">
                  テストの形式
                </label>
                <select
                  id="testFormat"
                  name="testFormat"
                  required
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                  value={formData.testFormat}
                  onChange={handleChange}
                >
                  <option value="">選択してください</option>
                  {testFormats.map((format) => (
                    <option key={format} value={format}>{format}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="testDuration" className="block text-sm font-medium text-gray-700 required-label">
                  テストの所要時間
                </label>
                <select
                  id="testDuration"
                  name="testDuration"
                  required
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                  value={formData.testDuration}
                  onChange={handleChange}
                >
                  <option value="">選択してください</option>
                  {durations.map((duration) => (
                    <option key={duration} value={duration}>{duration}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 required-label">
                  使用可能なプログラミング言語
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {programmingLanguageOptions.map((language) => (
                    <label key={language} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                        checked={formData.programmingLanguages.includes(language)}
                        onChange={() => handleLanguageChange(language)}
                      />
                      <span className="ml-2">{language}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="testContents" className="block text-sm font-medium text-gray-700 required-label">
                  テストの内容
                </label>
                <textarea
                  id="testContents"
                  name="testContents"
                  required
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.testContents}
                  onChange={handleChange}
                  placeholder="出題された問題の種類や内容について具体的に記述してください"
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
                  placeholder="どのように準備・対策を行ったか記述してください"
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
                  placeholder="後輩へのアドバイスや補足事項があれば記述してください"
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