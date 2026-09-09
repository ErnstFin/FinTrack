<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\View\View;

class AppController extends Controller
{
    /**
     * Display the main FinTrack personal finance web app.
     */
    public function index(): View
    {
        return view('app');
    }
}
