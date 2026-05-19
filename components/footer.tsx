export function Footer() {
  return (
    <footer className="mt-4 pt-4 fixed bottom-0 left-0 w-full text-center text-">
      <div className="text-center text-zinc-400 dark:text-zinc-500 text-xs py-2">
        <div className="flex justify-center gap-4 items-center">
          <p>© {new Date().getFullYear()} Designed By Vivek</p>
        </div>
      </div>
    </footer>
  )
}
/*export function Footer() {
  return (
    <footer className="mt-4 pt-4 fixed bottom-0 left-0 w-full text-center text-zinc-400 dark:text-zinc-500 text-xs py-2 bg-white dark:bg-black">
      <div className="flex justify-center gap-4 items-center">
        <p>© {new Date().getFullYear()} Designed By Vivek</p>
      </div>
    </footer>
  );
}
*/