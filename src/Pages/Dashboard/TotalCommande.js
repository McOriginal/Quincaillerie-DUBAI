import { Card, CardBody, CardImg, CardTitle, Col } from 'reactstrap';
import LoadingSpiner from '../components/LoadingSpiner';

import comImg from './../../assets/images/passer-la-commande.png';
import { useAllCommandes } from '../../Api/queriesCommande';

export default function TotalCommande() {
  // Traitement Data
  const {
    data: commandeData,
    isLoading: loadingCommande,
    error: commandeError,
  } = useAllCommandes();

  return (
    <div>
      {loadingCommande && <LoadingSpiner />}
      {!commandeError && !loadingCommande && (
        <Card
          style={{
            height: '150px',
            boxShadow: '1px 0px 10px rgba(1, 186, 186, 0.57)',
          }}
        >
          <CardImg
            src={comImg}
            alt='Traitements'
            style={{ height: '90px', objectFit: 'contain' }}
          />
          <CardBody>
            <CardTitle className='text-center'>
              Commandes:{' '}
              <span className='text-info fs-5'>
                {commandeData?.commandesListe?.length}
              </span>
            </CardTitle>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
