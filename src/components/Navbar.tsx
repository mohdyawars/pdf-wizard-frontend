import logo from '../assets/pdf_wiz.png';

const Navbar = () => {
    return (
        <nav className='bg-slate-700 p-4'>
            <div className='max-w-7xl mx-auto flex justify-between items-center'>
                {/* Logo */}
                <div className='flex items-center space-x-2'>
                    <img
                        src={logo}
                        alt='PDF Wizard Logo'
                        className='h-10 w-auto rounded-lg shadow-md'
                    />
                    <span className='text-white text-xl font-bold'>
                        PDF Wizard
                    </span>
                </div>

                {/* Navigation Links */}
                <div className='flex space-x-6'>
                    <a href='#' className='text-gray-300 hover:text-white'>
                        Home
                    </a>
                    <a href='#' className='text-gray-300 hover:text-white'>
                        About
                    </a>
                    <a href='#' className='text-gray-300 hover:text-white'>
                        Contact
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
