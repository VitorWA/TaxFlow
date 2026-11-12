<?php

namespace App\Policies;

use App\Models\Company;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CompanyPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function view(User $user, Company $company): Response
    {
        return $company->users()->where('users.id', $user->id)->exists()
            ? Response::allow() : Response::denyAsNotFound();
    }

    public function update(User $user, Company $company): Response
    {
        if ($this->view($user, $company)->denied()) {
            return Response::denyAsNotFound();
        }

        return $company->users()->where('users.id', $user->id)->wherePivot('role', 'owner')->exists()
            ? Response::allow() : Response::deny('Apenas o proprietário pode alterar a empresa.');
    }
}
