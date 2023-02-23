<?php

namespace App\Http\Controllers\Api;

use App\Models\Profile;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Response;

class ProfileController extends Controller
{
    public function fetch(string $username)
    {
        //dd($username);
        if ($profile = Profile::where('username', $username)->first())
            return $profile;
        else {
            $c = curl_init("https://api.github.com/users/{$username}/repos");
            curl_setopt_array($c, [
                CURLOPT_USERAGENT => "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
                CURLOPT_RETURNTRANSFER => TRUE,
            ]);

            $res = curl_exec($c);

            $data = json_decode($res, true);

            if(isset($data['message'])){
                return Response::json([
                    'message' => $data['message']
                ],404);
            }

            $stars = 0;

            foreach ($data as $rep) {
                $stars += intval($rep['stargazers_count']);
            }
            $avatar = $data[0]['owner']['avatar_url'];

            $prof = new Profile([
                'username' => $username,
                'stars' => $stars,
                'avatar_url' => $avatar
            ]);
            $prof->save();
            $prof->refresh();

            return $prof;
        }
    }
}
