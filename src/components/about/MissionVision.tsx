import { Card } from '@/components/ui/card';
import { PRIMARY_COLOR, ACCENT_COLOR } from '@/lib/constants';
import { FaEye } from 'react-icons/fa6';
import { FiTarget } from 'react-icons/fi';

export default function MissionVision() {
	return (
		<section className='py-20 bg-gray-50'>
			<div className='max-w-7xl mx-auto px-6'>
				<div className='grid lg:grid-cols-2 gap-8'>
					<Card className='bg-white border-0 shadow-xl rounded-3xl px-6 py-8 hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1'>
						<div
							className='w-14 h-14 rounded-2xl flex items-center justify-center mb-1'
							style={{ backgroundColor: ACCENT_COLOR }}
						>
							<FiTarget className='w-9 h-9' style={{ color: PRIMARY_COLOR }} />
						</div>
						<h3 className='text-3xl font-bold text-gray-900 mb-0'>
							Our Mission
						</h3>
						<p className='text-md text-gray-600 leading-relaxed'>
							To empower businesses of all sizes with intelligent
							inventory management tools that are simple to use,
							powerful in functionality, and accessible to everyone. We
							believe that great inventory management should&apos;nt require a degree in logistics and or a massive budget.
						</p>
					</Card>

					<Card className='bg-white border-0 shadow-xl rounded-3xl px-6 py-8 hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1'>
						<div
							className='w-14 h-14 rounded-2xl flex items-center justify-center mb-1'
							style={{ backgroundColor: ACCENT_COLOR }}
						>
							<FaEye className='w-9 h-9' style={{ color: PRIMARY_COLOR }} />
						</div>
						<h3 className='text-3xl font-bold text-gray-900 mb-0'>
							Our Vision
						</h3>
						<p className='text-md text-gray-600 leading-relaxed'>
							To become the world&apos;s most trusted inventory
							management platform, helping millions of businesses
							eliminate stock headaches and unlock new growth
							opportunities. We envision a future where inventory
							is never a bottleneck — only a superpower.
						</p>
					</Card>
				</div>
			</div>
		</section>
	);
}