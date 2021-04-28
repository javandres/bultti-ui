import styled from 'styled-components/macro'
import Dropdown from '../input/Dropdown'

export const SidebarStyledDropdown = styled(Dropdown)`
  > label {
    padding-left: 1rem;
    margin-top: 2rem;
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--dark-blue);
    font-size: 0.875rem;
    text-transform: uppercase;
    color: #eeeeee;
  }

  > div {
    padding: 0 1rem;

    > button {
      border: 1px solid var(--dark-blue);
      &:hover {
        background: var(--lighter-grey);
        transition: 0s;
        > svg * {
          fill: var(--dark-grey);
        }
      }
    }
  }

  ul {
    left: 1rem;
    width: calc(100% - 2rem);
    background: var(--dark-grey);
    border: 1px solid var(--dark-blue);

    > li {
      color: white;
      font-size: 1rem;
    }
  }
`
