export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="product-section">
      {children}
    </div>
  );
}
