import { useState, useEffect } from 'react'

export default function Profile() {
  const [user, setUser]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    fetch('/api/user')      
      .then(res => {
        if (!res.ok) throw new Error(res.status)
        return res.json()
      })
      .then(data => {
        setUser(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setError('Impossible de charger le profil')
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Chargement du profil...</p>
  if (error)   return <p>{error}</p>

  return (
    <div>
      <h2>Bienvenue, {user.username}</h2>

      <h3>Ma watchlist</h3>
      <ul>
        {user.watchlist.map(movie => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </div>
  )
}
