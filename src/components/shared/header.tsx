import Image from 'next/image';

export const Header = () => {
	return (
		<header>
			<nav className='flex items-center bg-rhinoThemeColor shadow-lg h-20'>
				<div className='w-full 2xl:container 2xl:mx-auto px-8'>
					<div className='flex items-center'>
						<div className='logo flex items-center gap-3'>
							<Image
								src='/logo.svg'
								alt='project-x Logo'
								width={40}
								height={40}
								priority
							/>
							<h2 className='font-light text-2xl leading-6 text-black'>
								Project X
							</h2>
						</div>
					</div>
				</div>
			</nav>
		</header>
	);
};
