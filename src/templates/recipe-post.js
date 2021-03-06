import React from 'react';
import Container from '@material-ui/core/Container';
import Layout from '../components/layout';
import SubHeading from '../components/recipe/SubHeading';
import Ingredient from '../components/recipe/Ingredient';
import Direction from '../components/recipe/Direction';
import Mast from '../components/recipe/Mast';
import matchAll from 'string.prototype.matchall';

matchAll.shim();

const parseIngredient = (ingredient) => {
  const expression = RegExp(/{{([^}]*)}}/g);

  const keys = [...ingredient.matchAll(expression)]
    .map(([_, key]) => key)
    .reduce((acc, match) => ({ ...acc, [match]: true }), {});

  return { ingredient: ingredient.replace(expression, ''), attributes: keys };
};

const RecipePost = ({ data }) => {
  const { recipe } = data;

  return (
    <Layout>
      <Container>
        <Mast
          image={recipe.images[0].childImageSharp.fluid}
          meta={recipe.meta}
          title={recipe.title}
        />
        <SubHeading>Ingredients</SubHeading>
        <Ingredient.List>
          {recipe.ingredients.map((source, i) => {
            const { ingredient, attributes } = parseIngredient(source);
            return (
              <Ingredient.Item strong={attributes.strong} key={i}>
                {ingredient}
              </Ingredient.Item>
            );
          })}
        </Ingredient.List>

        <SubHeading>Directions</SubHeading>
        <Direction.List>
          {recipe.directions.map((direction, i) => (
            <Direction.Item key={i}>
              {i + 1}. {direction}
            </Direction.Item>
          ))}
        </Direction.List>
      </Container>
    </Layout>
  );
};

export default RecipePost;

export const query = graphql`
  query($id: String!) {
    recipe: dataJson(id: { eq: $id }) {
      id
      ingredients
      title
      stars
      images {
        childImageSharp {
          fluid(maxWidth: 1920) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      directions
      meta {
        cook
        prep
        ready_in
      }
    }
  }
`;
