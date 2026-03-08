export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (username === "admin" && password === "123456") {
    return Response.json({
      success: true,
      token: "admin-token-" + Date.now()
    });
  }

  return Response.json({
    success: false,
    error: "Invalid credentials"
  }, { status: 401 });
}
