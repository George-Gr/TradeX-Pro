const InternalError = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-background">
    <h1 className="text-4xl font-bold mb-4">500 - Internal Server Error</h1>
    <p className="text-muted-foreground mb-8">Something went wrong. Please try again later.</p>
    <a href="/" className="text-primary hover:underline">
      Go to Home
    </a>
  </div>
);

export default InternalError;
