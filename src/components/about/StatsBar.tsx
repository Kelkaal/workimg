import { Calendar, Users, Globe, Smile } from 'lucide-react';
import { PRIMARY_COLOR } from '@/lib/constants';

export default function StatsBar() {
	const stats = [
		{ icon: Calendar, value: '2020', label: 'Founded' },
		{ icon: Smile, value: '5,000+', label: 'Happy Customers' },
		{ icon: Users, value: '50+', label: 'Team Members' },
		{ icon: Globe, value: '30+', label: 'Countries Served' },
	];

	return (
		<section className='py-8' style={{ backgroundColor: PRIMARY_COLOR }}>
			<div className='max-w-7xl mx-auto px-6'>
				<div className='grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white'>
					{stats.map(({ icon: Icon, value, label }) => (
						<div key={label} className="transition-all duration-300 ease-in-out hover:scale-105">
							<div className='flex justify-center mb-3'>
								<Icon className='w-10 h-10 text-red-200' />
							</div>
							<p className='text-4xl font-bold'>{value}</p>
							<p className='text-red-100 mt-2 text-lg'>{label}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}