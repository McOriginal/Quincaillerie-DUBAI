import { Card, CardBody, CardImg, CardTitle } from 'reactstrap';
import LoadingSpiner from '../components/LoadingSpiner';

import articleImg from './../../assets/images/package.png';
import { useAllProduitWithStockInferieure } from '../../Api/queriesProduits';

export default function TotalArticleSansStock() {
  // Article Data
  const {
    data: articleData,
    isLoading: articlesLoading,
    error: articlesError,
  } = useAllProduitWithStockInferieure();

  return (
    <div>
      {articlesLoading && <LoadingSpiner />}
      {!articlesError && !articlesLoading && (
        <Card
          style={{
            height: '150px',
            boxShadow: '1px 0px 10px rgba(1, 186, 186, 0.57)',
          }}
        >
          <CardImg
            src={articleImg}
            alt='articles'
            style={{ height: '90px', objectFit: 'contain' }}
          />
          <CardBody>
            <CardTitle className='text-center'>
              Stock Faible:{' '}
              <span className='text-danger fs-5'>{articleData.length}</span>
            </CardTitle>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
