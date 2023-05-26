<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

/**
 * ブラウザからドメインでアクセスした場合のサイト表示コントローラー
 */
class DomainController extends Controller
{
    public function index(Request $request)
    {
        $params = $this->paramsFromRequest();
        $params->put('domain', $request->host());
        $params->put('pathname', $request->path());

        $service = $this->service('SiteService');
        $page = $service->getPageFromUrl($params);
        if ($page === null) {
            abort(404);
        }

        return view('index', [
            'page' => $page,
        ]);
    }
}
