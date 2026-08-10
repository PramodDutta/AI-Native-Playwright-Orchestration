// THE single import point. Every spec imports test/expect from here and only here.
import { test as base, mergeTests, request } from '@playwright/test';
import { test as pageObjectFixture } from './page-object-fixture';
import { test as apiRequestFixture } from '../api/api-request-fixture';

const test = mergeTests(pageObjectFixture, apiRequestFixture);
const expect = base.expect;

export { test, expect, request };
