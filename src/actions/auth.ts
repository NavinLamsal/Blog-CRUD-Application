export async function registerUser(email: string, password: string , confirmPassword: string) {
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password , confirmPassword }),
      })
  
      const data = await res.json()
  
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed')
      }
  
      return data
    } catch (error: any) {
      throw new Error(error.message || 'Something went wrong')
    }
  }
  

  export async function loginUser(email: string, password: string) {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
  
      const data = await res.json()
  
      if (!res.ok) {
        throw new Error(data.message || 'Login failed')
      }
  
      // Token is set as cookie by API, no need to handle here
      return data
    } catch (error: any) {
      throw new Error(error.message || 'Something went wrong')
    }
  }
  