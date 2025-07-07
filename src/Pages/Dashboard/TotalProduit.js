import { Card, CardBody, CardImg, CardTitle, Col } from 'reactstrap';
import LoadingSpiner from '../components/LoadingSpiner';

import produitImage from './../../assets/images/product.png';
import { useAllProduit } from '../../Api/queriesProduits';

export default function TotalProduit() {
  // Importing the useAllPatients hook to fetch patient data
  const {
    data: produitData,
    isLoading: produitLoading,
    error: produitError,
  } = useAllProduit();

  return (
    <div>
      {produitLoading && <LoadingSpiner />}
      {!produitError && !produitLoading && (
        <Card
          style={{
            height: '150px',
            boxShadow: '1px 0px 10px rgba(1, 186, 186, 0.57)',
          }}
        >
          <CardImg
            src={produitImage}
            alt='Patients'
            style={{ height: '90px', objectFit: 'contain' }}
          />
          <CardBody>
            <CardTitle className='text-center'>
              Articles:{' '}
              <span className='text-info fs-5'>{produitData.length}</span>
            </CardTitle>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
