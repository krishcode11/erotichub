const Footer = () => {
	return (
		<footer className='py-6 md:px-8 md:py-0 bg-black text-white border-t border-gray-800'>
			<div className='flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row'>
				<p className='text-balance text-center text-sm leading-loose text-muted-foreground md:text-left'>
					© 2024 Netflix Clone. All rights reserved. This project is for educational purposes only.
				</p>
				<div className="flex space-x-4">
					<a href="#" className="text-sm text-gray-400 hover:text-white">Terms of Service</a>
					<a href="#" className="text-sm text-gray-400 hover:text-white">Privacy Policy</a>
					<a href="#" className="text-sm text-gray-400 hover:text-white">Contact Us</a>
				</div>
			</div>
		</footer>
	);
};
export default Footer;
