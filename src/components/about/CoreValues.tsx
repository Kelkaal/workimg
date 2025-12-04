import { Card } from '@/components/ui/card';
import { PRIMARY_COLOR, ACCENT_COLOR } from '@/lib/constants';
import { FaDiamond, FaHandshake, FaLightbulb, FaRocket, FaShield, FaUsers } from 'react-icons/fa6';

const values = [
	{
		icon: FaUsers,
		title: 'Customer First',
		desc: 'Our customers are at the heart of everything we do. We listen, learn and build solutions that truly solve their problems.',
	},
	{
		icon: FaLightbulb,
		title: 'Innovation',
		desc: 'We constantly push boundaries and embrace new technologies to deliver cutting-edge solutions that stay ahead of the curve.',
	},
	{
		icon: FaDiamond,
		title: 'Simplicity',
		desc: 'We believe powerful sofware doesn&apos;t have to be complicated. We design with clarity and ease of use in mind.',
	},
	{
		icon: FaShield,
		title: 'Integrity',
		desc: 'We operate with transparency, honesty and ethical practices in all our business dealings and relationships.',
	},
	{
		icon: FaRocket,
		title: 'Excellence',
		desc: 'We strive for excellence in every detail, from product quality to customer support, never settling for good enough.',
	},
	{
		icon: FaHandshake,
		title: 'Collaboration',
		desc: 'We believe in the power of teamwork and foster a culture where diverse perspectives drive better outcomes.',
	},
];

export default function CoreValues() {
	return (
		<section className='py-20 bg-white'>
			<div className='max-w-7xl mx-auto px-6'>
				<h2 className='text-4xl font-bold text-center text-gray-900 mb-4'>
					Our Core Values
				</h2>
				<p className='text-center text-gray-600 mb-16 max-w-2xl mx-auto'>
					The principles that guide everything we do
				</p>

				<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
					{values.map(({ icon: Icon, title, desc }) => (
						<Card
							key={title}
							className='bg-gray-50 	rounded-3xl px-6 py-8 hover:shadow-xl 
								border border-gray-100 transition-all duration-300 
							flex flex-col items-start ease-in-out transform hover:-translate-y-1'>
							<div
								className='w-14 h-14 rounded-2xl flex items-center justify-center mb-2'
								style={{ backgroundColor: ACCENT_COLOR }}
							>
								<Icon className='w-7 h-7' style={{ color: PRIMARY_COLOR }} />
							</div>
							<h4 className='text-xl font-bold text-gray-900 mb-0'>
								{title}
							</h4>
							<p className='text-gray-600'>{desc}</p>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}