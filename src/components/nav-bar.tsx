import { GithubIcon, Search } from 'lucide-react';
import { ModeToggle } from './mode-toggle';
import { Button } from './ui/button';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 md:flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <Search />
            <span className="font-bold sm:inline-block">Wordle Solver</span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center">
            <a
              href="https://github.com/phildaniels/wordle-solver"
              target="_blank"
            >
              <Button variant="ghost" size="icon">
                <GithubIcon className="h-4 w-4" />
              </Button>
              <ModeToggle />
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
