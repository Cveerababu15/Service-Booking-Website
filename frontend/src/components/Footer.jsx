export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 text-center py-4 text-sm text-gray-500 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <p>&copy; {new Date().getFullYear()} <span className="font-semibold text-indigo-600">ServiceHub</span>. All rights reserved.</p>
      </div>
    </footer>
  );
}
