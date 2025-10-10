const AccessDenied = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-background">
    <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
    <p className="text-muted-foreground mb-8">You do not have permission to view this page.</p>
    <a href="/" className="text-primary hover:underline">
      Go to Home
    </a>
  </div>
);

export default AccessDenied;
