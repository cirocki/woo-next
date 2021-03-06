import Layout from "../components/Layout";
import { withRouter } from 'next/router';
import client from "../components/ApolloClient";
import gql from 'graphql-tag';
import AddToCartButton from "../components/cart/AddToCartButton";

const Product = withRouter( props => {

	const { product } = props;

	return (

				<Layout>
					{ product ? (
						<div className="woo-next-single">
							<div className="woo-next-single__product card bg-light mb-3 p-5">
								<div className="card-header">{ product.name }</div>
								<div className="card-body">
									<h4 className="card-title">{ product.name }</h4>
									<img src={ product.image.sourceUrl } alt="Product Image" width="200" srcSet={ product.image.srcSet }/>
									<p
										dangerouslySetInnerHTML={ {
											__html: product.description,
										} }
										className="card-text"/>

									<AddToCartButton product={ product }/>

								</div>
							</div>
						</div>
					) : '' }
				</Layout>

	)
});

Product.getInitialProps = async function( context ) {

	let { query: { slug } } = context;
	const id = slug ? parseInt( slug.split( '-' ).pop() ) : context.query.id;

	const PRODUCT_QUERY = gql` query Product( $id: ID! ) {
			product ( id: $id, idType: DATABASE_ID ) {
							id
							productId
							averageRating
							slug
							description
							image {
								uri
								title
								srcSet
								sourceUrl
							}
							name
						  ... on SimpleProduct {
					        price
					        id
					      }
					      ... on VariableProduct {
					        price
					        id
					      }
					      ... on ExternalProduct {
					        price
					        id
					        externalUrl
					      }
					      ... on GroupProduct {
					        products {
					          nodes {
					            ... on SimpleProduct {
					              price
					            }
					          }
					        }
					        id
					      }
					    }


	 }`;

	const res = await client.query(({
		query: PRODUCT_QUERY,
		variables: { id }
	}));

	return {
		product: res.data.product
	}

};


export default Product;
