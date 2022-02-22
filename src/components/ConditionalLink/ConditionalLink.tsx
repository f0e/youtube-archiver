import Link from 'next/link';
import { AnchorHTMLAttributes } from 'react';

interface ConditionalLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
	children: any;
	condition?: boolean;
}

export const ConditionalLink = ({
	children,
	condition,
	...props
}: ConditionalLinkProps) => {
	return (condition == undefined || condition) && props.href ? (
		<Link href={props.href} scroll={false}>
			<a {...props}>{children}</a>
		</Link>
	) : (
		<>{children}</>
	);
};

export default ConditionalLink;
