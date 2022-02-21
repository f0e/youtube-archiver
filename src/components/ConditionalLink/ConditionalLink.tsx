import Link from 'next/link';

export default function ConditionalLink({ children, to, condition }: any) {
	return !!condition && to ? (
		<Link href={to}>
			<a>{children}</a>
		</Link>
	) : (
		<>{children}</>
	);
}
