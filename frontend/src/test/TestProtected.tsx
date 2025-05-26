import { useEffect, useState } from 'react'
import { fetchWithAuth } from '../utils/fetchWithAuth'

export default function TestProtected() {
  const [result, setResult] = useState('')

  useEffect(() => {
    fetchWithAuth('http://localhost:5002/auth/protected')
      .then(res => {
        if (!res.ok) throw new Error('Token 驗證失敗')
        return res.json()
      })
      .then(data => setResult(JSON.stringify(data)))
      .catch(err => setResult('❌ 驗證失敗: ' + err.message))
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-2">JWT Token 驗證結果</h1>
      <pre className="bg-gray-100 p-4 rounded">{result}</pre>
    </div>
  )
}
