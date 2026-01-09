import { getTranslations } from 'next-intl/server';
import { NotFound } from '@/components/not-found';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'notFound',
  });
  return {
    title: `${t('heading')} | ErfanWeb`,
    description: t('description'),
  };
}

export default function RootNotFound() {
  return (
    <>
      <NotFound />
    </>
  );
}
