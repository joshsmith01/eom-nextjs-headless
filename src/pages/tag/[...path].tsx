import {
	usePosts,
	fetchHookData,
	addHookData,
	handleError,
	useAppSettings,
	HeadlessGetServerSideProps,
} from '@headstartwp/next';
import { Link } from '../../components/Link';
import { Pagination } from '../../components/Pagination';
import { resolveBatch } from '../../utils/promises';

const TagPage = () => {
	const { data } = usePosts({ taxonomy: 'post_tag' });

	return (
		<>
			{data.queriedObject.term ? <h1>Tag Page: {data.queriedObject.term.name}</h1> : null}
			<ul>
				{data.posts.map((post) => (
					<li key={post.id}>
						<Link href={post.link}>{post.title.rendered}</Link>
					</li>
				))}
			</ul>
			<Pagination pageInfo={data.pageInfo} />
		</>
	);
};

export default TagPage;

export const getServerSideProps = (async (context) => {
	try {
		const settledPromises = await resolveBatch([
			{
				func: fetchHookData(usePosts.fetcher(), context, {
					params: { taxonomy: 'post_tag' },
				}),
			},
			{ func: fetchHookData(useAppSettings.fetcher(), context), throw: false },
		]);

		return addHookData(settledPromises, {});
	} catch (e) {
		return handleError(e, context);
	}
}) satisfies HeadlessGetServerSideProps;
