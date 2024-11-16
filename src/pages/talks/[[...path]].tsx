/**
 * The blog route here exemplifies the power of the catch-all route strategy in the framework
 * This route can actually handle any taxonomy, author, pagination, date queries etc.
 *
 * In theory, you could handle multiple WordPress routes with this route, depending how you're structuring the application.
 *
 * If you wish to create specific routes for other archive pages check out the category, tag and author pages.
 *
 */
import {
	fetchHookData,
	addHookData,
	handleError,
	useAppSettings,
	usePostOrPosts,
	usePosts,
	HeadlessGetServerSideProps,
} from '@headstartwp/next';

import { Link } from '../../components/Link';
import { talksParams } from '../../params';
import { resolveBatch } from '../../utils/promises';
import { PageContent } from '../../components/PageContent';

const ArchiveBooks = () => {
	const { data } = usePosts(talksParams.archive);

	return (
		<>
			<h1>Talks Page</h1>
			<ul>
				{data.posts.map((post) => (
					<li key={post.id}>
						<Link href={post.link}>{post.title.rendered}</Link>
					</li>
				))}
			</ul>
		</>
	);
};

const BooksPage = () => {
	const { isArchive } = usePostOrPosts(talksParams);
	console.log('isArchive: ', isArchive);
	if (isArchive) {
		return <ArchiveBooks />;
	}

	return <PageContent params={talksParams.single} />;
};

export default BooksPage;

export const getServerSideProps = (async (context) => {
	try {
		const settledPromises = await resolveBatch([
			{
				func: fetchHookData(usePostOrPosts.fetcher(), context, { params: talksParams }),
			},
			{ func: fetchHookData(useAppSettings.fetcher(), context), throw: false },
		]);

		return addHookData(settledPromises, {});
	} catch (e) {
		return handleError(e, context);
	}
}) satisfies HeadlessGetServerSideProps;
