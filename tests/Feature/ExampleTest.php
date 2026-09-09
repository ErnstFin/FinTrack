<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * Test landing page renders successfully.
     */
    public function test_landing_page_returns_a_successful_response(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);
        $response->assertSee('Ngaturuang');
    }

    /**
     * Test main FinTrack app dashboard renders successfully.
     */
    public function test_app_dashboard_returns_a_successful_response(): void
    {
        $response = $this->get('/app');
        $response->assertStatus(200);
        $response->assertSee('FinTrack');
    }

    /**
     * Test /feature compatibility redirect.
     */
    public function test_feature_redirects_to_app(): void
    {
        $response = $this->get('/feature');
        $response->assertRedirect('/app');
    }
}
