'use client';

import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Category = {
  id: string;
  name: string;
};

export default function SellPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('baik');
  const [image, setImage] = useState<File | null>(null);
  const [hasStore, setHasStore] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      let imageUrl = null;

      if (image) {
        const reader = new FileReader();

        reader.readAsDataURL(image);

        const base64 = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
        });

        const uploadRes = await axios.post('/api/upload', {
          image: base64,
        });

        imageUrl = uploadRes.data.url;
      }

      await axios.post(
        '/api/products/create',
        {
          name,
          description,
          price: Number(price),
          condition,
          categoryId: categoryId || null,
          image: imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert('Product created!');

      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const checkStoreAndCategories = async () => {
      const token = localStorage.getItem('token');

      if (!token) return;

      try {
        const [storeRes, categoriesRes] = await Promise.all([
          axios.get('/api/stores/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get('/api/categories'),
        ]);

        if (!storeRes.data) {
          setHasStore(false);
          return;
        }

        setHasStore(true);
        setCategories(categoriesRes.data || []);
      } catch {
        setHasStore(false);
      }
    };

    checkStoreAndCategories();
  }, []);

  if (!hasStore) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <div className="text-6xl">🏪</div>
        <h2 className="text-2xl font-bold">Kamu belum punya toko</h2>
        <p className="text-gray-500">Buat toko dulu untuk mulai berjualan</p>
        <button
          onClick={() => router.push('/store-panel/settings')}
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
        >
          Buat Toko Sekarang
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8 md:px-6">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Jual Barang</h1>
          <p className="text-sm text-gray-500 mb-6">
            Lengkapi informasi produk agar pembeli lebih mudah menemukan
            barangmu.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-gray-400"
              placeholder="Nama barang"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-gray-400"
              placeholder="Harga"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />

            <textarea
              className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-gray-400 min-h-[120px]"
              placeholder="Deskripsi"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <select
                className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-gray-400 bg-white"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Pilih Kategori</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-gray-400 bg-white"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                <option value="buruk">Buruk</option>
                <option value="baik">Baik</option>
              </select>
            </div>

            <input
              type="file"
              accept="image/*"
              className="w-full rounded-xl border border-gray-200 p-3 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-medium"
              onChange={(e) => {
                if (e.target.files) {
                  setImage(e.target.files[0]);
                }
              }}
            />

            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Publish Product
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
