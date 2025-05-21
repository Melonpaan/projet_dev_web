
// Mock temporaire : simule toujours une connexion réussie
export function loginUser(email, password) {
  return Promise.resolve({
    token: "fake-token",
    userId: 1
  });
}

