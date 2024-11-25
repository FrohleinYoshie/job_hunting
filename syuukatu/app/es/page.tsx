'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface ESEntry {
  id: string;
  company_name: string;
  job_type: string;
  graduation_year: string;
  es_format: string;
  es_theme: string;
  important_points: string;
  preparation_methods: string;
  created_at: string;
  users_syukatu: {
    name: string;
    department: string;
  };
}

export default function ESListPage() {
  const [entries, setEntries] = useState<ESEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('es_entries_syukatu')
        .select(`
          *,
          users_syukatu (
            name,
            department
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch = 
      entry.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.job_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFormat = !selectedFormat || entry.es_format === selectedFormat;
    const matchesYear = !selectedYear || entry.graduation_year === selectedYear;
    
    return matchesSearch && matchesFormat && matchesYear;
  });

  const uniqueYears = Array.from(new Set(entries.map(entry => entry.graduation_year))).sort();
  const esFormats = ['履歴書の提出', 'フォームの回答'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              ES情報一覧
            </h1>
            <Link
              href="/es/register"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              新規登録
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <input
                type="text"
                placeholder="会社名または職種で検索"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
              >
                <option value="">ES形式で絞り込み</option>
                {esFormats.map((format) => (
                  <option key={format} value={format}>{format}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="">卒業年度で絞り込み</option>
                {uniqueYears.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">
              {entries.length === 0 
                ? 'まだESの登録がありません' 
                : '条件に一致するESが見つかりませんでした'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-900">
                      {entry.company_name}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {entry.graduation_year}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center space-x-2">
                    <p className="text-sm text-gray-500">
                      {entry.job_type}
                    </p>
                    <span className="text-gray-300">|</span>
                    <p className="text-sm text-gray-500">
                      {entry.users_syukatu.name}（{entry.users_syukatu.department}）
                    </p>
                  </div>
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">ES形式</p>
                      <p className="mt-1 text-sm text-gray-900">{entry.es_format}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">内容・テーマ</p>
                      <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                        {entry.es_theme}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">注意したこと</p>
                      <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                        {entry.important_points}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">対策内容</p>
                      <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                        {entry.preparation_methods}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-4 sm:px-6 text-xs text-gray-500">
                  登録日: {new Date(entry.created_at).toLocaleDateString('ja-JP')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="fixed bottom-4 right-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 shadow-lg"
        >
          ダッシュボードに戻る
        </Link>
      </div>
    </div>
  );
}