'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchUserProgression } from '@/features/game/actions/progression-actions';
import { useStoryProgression } from '@/features/game/hooks/useStoryProgression';
import { StoryLevel } from '@/shared/types/game';

export default function TestDBPage() {
  const router = useRouter();
  const [dbLevels, setDbLevels] = useState<StoryLevel[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { levels: hookLevels, isLoading: hookLoading } = useStoryProgression();

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    async function test() {
      try {
        console.log('🧪 TEST: Appel fetchUserProgression()...');
        const result = await fetchUserProgression();
        console.log('🧪 TEST: Résultat:', result);
        setDbLevels(result);
      } catch (e) {
        console.error('🧪 TEST: Erreur:', e);
        setError(e instanceof Error ? e.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    test();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Diagnostic Base de Données</h1>

        {/* Test Direct DB */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">📊 Test Direct fetchUserProgression()</h2>
          
          {loading && (
            <div className="text-yellow-400">⏳ Chargement...</div>
          )}
          
          {error && (
            <div className="bg-red-500 text-white p-4 rounded mb-4">
              <strong>❌ Erreur:</strong> {error}
            </div>
          )}
          
          <div className="mb-4">
            <strong>Niveaux trouvés:</strong> {dbLevels.length}
          </div>
          
          {dbLevels.length === 0 && !loading && (
            <div className="bg-yellow-900 border border-yellow-600 text-yellow-200 p-4 rounded mb-4">
              <strong>⚠️ Aucun niveau trouvé</strong>
              <p className="mt-2">Causes possibles:</p>
              <ul className="list-disc ml-6 mt-2">
                <li>Base de données vide → Exécutez <code className="bg-gray-700 px-2 py-1 rounded">database/insert_levels.sql</code></li>
                <li>Pas connecté → Cliquez sur &quot;Sign In&quot;</li>
                <li>Problème Supabase → Vérifiez .env.local</li>
              </ul>
            </div>
          )}
          
          {dbLevels.length > 0 && (
            <div className="bg-green-900 border border-green-600 text-green-200 p-4 rounded mb-4">
              <strong>✅ Niveaux chargés avec succès depuis Supabase !</strong>
            </div>
          )}
          
          <pre className="bg-gray-900 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(dbLevels, null, 2)}
          </pre>
        </div>

        {/* Test Hook */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">🔧 Test Hook useStoryProgression()</h2>
          
          {hookLoading && (
            <div className="text-yellow-400">⏳ Chargement...</div>
          )}
          
          <div className="mb-4">
            <strong>Niveaux dans le hook:</strong> {hookLevels.length}
          </div>
          
          {hookLevels.length === 0 && !hookLoading && (
            <div className="bg-red-900 border border-red-600 text-red-200 p-4 rounded mb-4">
              <strong>❌ Le hook ne retourne aucun niveau</strong>
            </div>
          )}
          
          {hookLevels.length > 0 && (
            <div className="bg-green-900 border border-green-600 text-green-200 p-4 rounded mb-4">
              <strong>✅ Le hook fonctionne !</strong>
            </div>
          )}
          
          <div className="space-y-2">
            {hookLevels.map((level, i) => (
              <div key={level.id} className="bg-gray-700 p-3 rounded">
                <div className="font-bold">{i + 1}. {level.title}</div>
                <div className="text-sm text-gray-400">
                  ID: {level.id} | Status: {level.status} | Ordre: {level.order}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Environnement */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">🔐 Variables d&apos;Environnement</h2>
          
          <div className="space-y-2">
            <div>
              <strong>NEXT_PUBLIC_SUPABASE_URL:</strong>{' '}
              <span className={process.env.NEXT_PUBLIC_SUPABASE_URL ? 'text-green-400' : 'text-red-400'}>
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Défini' : '❌ Manquant'}
              </span>
            </div>
            <div>
              <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong>{' '}
              <span className={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'text-green-400' : 'text-red-400'}>
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Défini' : '❌ Manquant'}
              </span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-900 border border-blue-600 text-blue-200 p-6 rounded">
          <h2 className="text-xl font-bold mb-4">📝 Prochaines Étapes</h2>
          
          {dbLevels.length === 0 && (
            <div>
              <p className="mb-4"><strong>Si aucun niveau n&apos;est trouvé:</strong></p>
              <ol className="list-decimal ml-6 space-y-2">
                <li>Ouvrir Supabase Dashboard → SQL Editor</li>
                <li>Copier le contenu de <code className="bg-gray-700 px-2 py-1 rounded">database/insert_levels.sql</code></li>
                <li>Exécuter le script</li>
                <li>Vérifier: <code className="bg-gray-700 px-2 py-1 rounded">SELECT * FROM levels;</code></li>
                <li>Rafraîchir cette page (F5)</li>
              </ol>
            </div>
          )}
          
          {dbLevels.length > 0 && hookLevels.length === 0 && (
            <div>
              <p className="mb-4"><strong>DB OK mais hook vide:</strong></p>
              <ol className="list-decimal ml-6 space-y-2">
                <li>Vérifier la console (F12) pour les erreurs</li>
                <li>Vérifier que vous êtes connecté (Clerk Sign In)</li>
                <li>Rafraîchir la page d&apos;accueil</li>
              </ol>
            </div>
          )}
          
          {dbLevels.length > 0 && hookLevels.length > 0 && (
            <div>
              <p className="mb-4"><strong>✅ Tout fonctionne !</strong></p>
              <p>Retournez sur la <Link href="/" className="text-blue-400 underline">page d&apos;accueil</Link> pour voir les niveaux.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
