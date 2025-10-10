const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-background">
    <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
    <p className="text-muted-foreground mb-8">
      Sorry, the page you are looking for does not exist.
    </p>
    <a href="/" className="text-primary hover:underline">
      Go to Home
    </a>
  </div>
);

export default NotFound;
